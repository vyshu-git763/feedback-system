from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import models, schemas
from typing import List
from ..dependencies import get_current_user
from ..dependencies import get_db

router = APIRouter()


@router.get("/employees", response_model=List[schemas.UserOut])
def get_employees(
    db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)
):
    return (
        db.query(models.User)
        .filter(
            models.User.role == models.RoleEnum.employee,
            models.User.id != current_user.id,
        )
        .all()
    )


@router.get("/users/managers", response_model=List[schemas.UserOut])
def get_managers(db: Session = Depends(get_db)):
    return (
        db.query(models.User).filter(models.User.role == models.RoleEnum.manager).all()
    )


@router.get("/users/me", response_model=schemas.UserOut)
def get_current_user_info(current_user: models.User = Depends(get_current_user)):
    return current_user
