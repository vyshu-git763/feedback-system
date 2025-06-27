from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from .. import models, schemas
from ..models import User, FeedbackRequest, Comment  
from ..dependencies import get_db, get_current_user  
from ..schemas import FeedbackRequestOut
from ..dependencies import get_db
import json

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


# Create feedback (Manager only)
@router.post("/feedback/", response_model=schemas.FeedbackOut)
def create_feedback(
    feedback: schemas.FeedbackCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if current_user.id == feedback.employee_id:
        raise HTTPException(
            status_code=400, detail="You cannot give feedback to yourself."
        )
    if current_user.role not in [models.RoleEnum.manager, models.RoleEnum.employee]:
        raise HTTPException(status_code=403, detail="Unauthorized to give feedback")
    db_feedback = models.Feedback(
        manager_id=current_user.id,
        employee_id=feedback.employee_id,
        strengths=feedback.strengths,
        improvements=feedback.improvements,
        sentiment=feedback.sentiment,
        anonymous=feedback.anonymous,
        tags=json.dumps(feedback.tags) if feedback.tags else "[]",
    )
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    return db_feedback


# Get all feedback received (Employee)
@router.get("/feedback/me", response_model=List[schemas.FeedbackOut])
def get_my_feedback(
    db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)
):
    if current_user.role != models.RoleEnum.employee:
        raise HTTPException(
            status_code=403, detail="Only employees can access their feedback"
        )
    return (
        db.query(models.Feedback)
        .filter(models.Feedback.employee_id == current_user.id)
        .all()
    )


# Get team feedback (Manager)
@router.get("/feedback/team", response_model=List[schemas.FeedbackOut])
def get_team_feedback(
    db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)
):
    if current_user.role != models.RoleEnum.manager:
        raise HTTPException(
            status_code=403, detail="Only managers can access team feedback"
        )
    return (
        db.query(models.Feedback)
        .filter(models.Feedback.manager_id == current_user.id)
        .all()
    )


# Update feedback (Manager only)
@router.patch("/feedback/{feedback_id}", response_model=schemas.FeedbackOut)
def update_feedback(
    feedback_id: int,
    updated: schemas.FeedbackBase,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    feedback = (
        db.query(models.Feedback).filter(models.Feedback.id == feedback_id).first()
    )
    if not feedback:
        raise HTTPException(status_code=404, detail="Feedback not found")
    if feedback.manager_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="Not authorized to update this feedback"
        )

    feedback.strengths = updated.strengths
    feedback.improvements = updated.improvements
    feedback.sentiment = updated.sentiment
    db.commit()
    db.refresh(feedback)
    return feedback


# Acknowledge feedback (Employee only)
@router.post("/feedback/{feedback_id}/ack")
def acknowledge_feedback(
    feedback_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    feedback = (
        db.query(models.Feedback).filter(models.Feedback.id == feedback_id).first()
    )
    if not feedback:
        raise HTTPException(status_code=404, detail="Feedback not found")
    if feedback.employee_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your feedback")

    feedback.acknowledged = True
    db.commit()
    return {"message": "Feedback acknowledged"}


@router.put("/feedback/{feedback_id}", response_model=schemas.FeedbackOut)
def update_feedback(
    feedback_id: int,
    updated: schemas.FeedbackUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    feedback = (
        db.query(models.Feedback).filter(models.Feedback.id == feedback_id).first()
    )
    if not feedback:
        raise HTTPException(status_code=404, detail="Feedback not found")
    if current_user.role != "manager" or current_user.id != feedback.manager_id:
        raise HTTPException(
            status_code=403, detail="Not authorized to edit this feedback"
        )

    feedback.strengths = updated.strengths
    feedback.improvements = updated.improvements
    feedback.sentiment = updated.sentiment

    db.commit()
    db.refresh(feedback)
    return feedback


@router.get("/dashboard/manager")
def get_manager_dashboard(
    db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)
):
    if current_user.role != "manager":
        raise HTTPException(status_code=403, detail="Access denied")

    total_feedbacks = (
        db.query(models.Feedback)
        .filter(models.Feedback.manager_id == current_user.id)
        .count()
    )

    sentiment_counts = (
        db.query(models.Feedback.sentiment, func.count(models.Feedback.id))
        .filter(models.Feedback.manager_id == current_user.id)
        .group_by(models.Feedback.sentiment)
        .all()
    )

    sentiment_summary = {
        sentiment.value: count for sentiment, count in sentiment_counts
    }

    return {"total_feedbacks": total_feedbacks, "sentiment_summary": sentiment_summary}


@router.post("/request-feedback/", response_model=schemas.FeedbackRequestOut)
def request_feedback(
    request: schemas.FeedbackRequestCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if current_user.role != models.RoleEnum.employee:
        raise HTTPException(
            status_code=403, detail="Only employees can request feedback"
        )

    new_request = models.FeedbackRequest(
        employee_id=current_user.id,
        manager_id=request.manager_id,
        message=request.message,
    )
    db.add(new_request)
    db.commit()
    db.refresh(new_request)
    return new_request


@router.get("/dashboard/employee")
def get_employee_dashboard(
    db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)
):
    if current_user.role != "employee":
        raise HTTPException(status_code=403, detail="Access denied")

    feedbacks = (
        db.query(models.Feedback)
        .filter(models.Feedback.employee_id == current_user.id)
        .order_by(models.Feedback.created_at.desc())
        .all()
    )
    return feedbacks


@router.get("/requests", response_model=List[FeedbackRequestOut])
def get_requests_for_manager(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if current_user.role != models.RoleEnum.manager:
        raise HTTPException(
            status_code=403, detail="Only managers can view feedback requests"
        )

    return (
        db.query(models.FeedbackRequest)
        .filter(FeedbackRequest.manager_id == current_user.id)
        .order_by(FeedbackRequest.created_at.desc())
        .all()
    )


@router.post("/feedback/{feedback_id}/comments", response_model=schemas.CommentOut)
def add_comment(
    feedback_id: int,
    comment: schemas.CommentCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    feedback = (
        db.query(models.Feedback).filter(models.Feedback.id == feedback_id).first()
    )
    if not feedback or feedback.employee_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="Not allowed to comment on this feedback."
        )

    new_comment = models.Comment(
        feedback_id=feedback_id, user_id=current_user.id, content=comment.content
    )
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    return new_comment


@router.get("/feedback/{feedback_id}/comments", response_model=List[schemas.CommentOut])
def get_comments(
    feedback_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return (
        db.query(models.Comment).filter(models.Comment.feedback_id == feedback_id).all()
    )


@router.delete("/feedback/comments/{comment_id}")
def delete_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    comment = db.query(models.Comment).filter(models.Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    if comment.user_id != current_user.id and current_user.role != "manager":
        raise HTTPException(
            status_code=403, detail="Not allowed to delete this comment"
        )
    db.delete(comment)
    db.commit()
    return {"message": "Comment deleted"}


# Peer Feedback (Employee to Employee)
@router.post("/feedback/peer", response_model=schemas.FeedbackOut)
def give_peer_feedback(
    feedback: schemas.FeedbackCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if current_user.role != models.RoleEnum.employee:
        raise HTTPException(
            status_code=403, detail="Only employees can give peer feedback"
        )

    if not feedback.recipient_id:
        raise HTTPException(status_code=400, detail="Recipient ID is required")

    if feedback.recipient_id == current_user.id:
        raise HTTPException(
            status_code=400, detail="You cannot give feedback to yourself"
        )

    peer_feedback = models.Feedback(
        strengths=feedback.strengths,
        improvements=feedback.improvements,
        sentiment=feedback.sentiment,
        employee_id=feedback.recipient_id,
        manager_id=None,
        anonymous=feedback.anonymous,
        tags=feedback.tags, 
    )

    db.add(peer_feedback)
    db.commit()
    db.refresh(peer_feedback)
    return peer_feedback
