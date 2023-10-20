from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app import database
from schemas.schema import CreateUpdateTagSchema, TagSchema
from crud import tag
router = APIRouter()


@router.get('/', response_model=list[TagSchema])
def read(db: Session = Depends(database.get_db), skip: int = 0, limit: int = 100):
    """
    Retrieve todos.
    """

    tags = tag.get(db=db, skip=skip, limit=limit)
    return tags


@router.get("/{tag_id}", response_model=TagSchema)
def read_by_id(tag_id: int, db: Session = Depends(database.get_db)):
    tag_model = tag.get_by_id(db, tag_id)
    if not tag_model:
        raise HTTPException(status_code=404, detail="Tag not found")
    return tag_model


@router.post("/", response_model=TagSchema)
def create(tag_schema: CreateUpdateTagSchema, db: Session = Depends(database.get_db)):
    tag_model = tag.create(db, tag_schema)
    return TagSchema.model_validate(tag_model)


@router.put("/{tag_id}")
def update(tag_id: int, update_tag_schema: CreateUpdateTagSchema, db: Session = Depends(database.get_db)):
    tag_model = tag.update(db, tag_id, update_tag_schema)
    if not tag_model:
        raise HTTPException(status_code=404, detail="Tag not found")
    return Response(status_code=status.HTTP_200_OK)


@router.delete("/{tag_id}")
def delete(tag_id: int, db: Session = Depends(database.get_db)):
    tag.delete(db, tag_id)
    return Response(status_code=status.HTTP_200_OK)
