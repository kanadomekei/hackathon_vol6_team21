from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text

from sqlalchemy.ext.declarative import declarative_base

import datetime



Base = declarative_base()



class User(Base):

    __tablename__ = "users"

    id = Column(Integer, primary_key=True)

    username = Column(String(50), nullable=False)

    email = Column(String(255), nullable=False, unique=True)

    password = Column(String(255), nullable=False)

    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)



class Post(Base):

    __tablename__ = "posts"

    id = Column(Integer, primary_key=True)

    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)

    image_url = Column(String(255), nullable=False)

    caption = Column(Text)

    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)



class Comment(Base):

    __tablename__ = "comments"

    id = Column(Integer, primary_key=True)

    post_id = Column(Integer, ForeignKey('posts.id'), nullable=False)

    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)

    content = Column(Text)

    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)



class Like(Base):

    __tablename__ = "likes"

    id = Column(Integer, primary_key=True)

    post_id = Column(Integer, ForeignKey('posts.id'), nullable=False)

    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)

    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)



class Recipe(Base):

    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True)

    post_id = Column(Integer, ForeignKey('posts.id'), nullable=False)

    ingredients = Column(Text)

    instructions = Column(Text)

    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
