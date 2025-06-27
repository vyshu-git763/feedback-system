
from pydantic import BaseModel, field_validator
from enum import Enum
from typing import Optional, List
from datetime import datetime
from .models import SentimentEnum
import json


class RoleEnum(str, Enum):
    manager = "manager"
    employee = "employee"


class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    email: str
    password: str
    role: RoleEnum


class UserOut(UserBase):
    id: int
    email: str
    role: RoleEnum

    class Config:
        form_attributes = True


class UserLogin(BaseModel):
    username: str | None = None
    email: str | None = None
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class FeedbackBase(BaseModel):
    strengths: str
    improvements: str
    sentiment: SentimentEnum
    anonymous: Optional[bool] = False   
    tags: List[str] = []  


class FeedbackCreate(BaseModel):
    strengths: str
    improvements: str
    sentiment: SentimentEnum
    employee_id: Optional[int] = None   
    recipient_id: Optional[int] = None  
    anonymous: Optional[bool] = False
    tags: List[str] = [] 


class FeedbackOut(FeedbackBase):
    id: int
    manager_id: int
    employee_id: int
    acknowledged: bool
    created_at: datetime
    tags: List[str] = [] 

    @field_validator("tags", mode="before")
    @classmethod
    def parse_tags(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                return []
        return v

    class Config:
        form_attributes = True 


class FeedbackUpdate(BaseModel):
    strengths: str
    improvements: str
    sentiment: SentimentEnum
    tags: List[str] = []  

    class Config:
        form_attributes = True


class FeedbackRequestCreate(BaseModel):
    manager_id: int
    message: str | None = None


class FeedbackRequestOut(BaseModel):
    id: int
    employee_id: int
    manager_id: int
    message: str | None
    created_at: datetime

    class Config:
        form_attributes = True


class CommentCreate(BaseModel):
    feedback_id: int
    content: str


class CommentOut(BaseModel):
    id: int
    user_id: int
    feedback_id: int
    content: str
    created_at: datetime

    class Config:
        form_attributes = True


class MessageResponse(BaseModel):
    message: str


class CommentUpdate(BaseModel):
    content: str
