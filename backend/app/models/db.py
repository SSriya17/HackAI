"""Database setup - SQLite for dev, easy swap to Postgres for scale."""
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


def get_engine(database_url: str):
    return create_async_engine(
        database_url,
        echo=False,
    )


def get_session_maker(engine):
    return async_sessionmaker(
        engine,
        class_=AsyncSession,
        expire_on_commit=False,
        autoflush=False,
    )


engine = None
session_factory = None


def init_db(database_url: str):
    global engine, session_factory
    engine = get_engine(database_url)
    session_factory = get_session_maker(engine)
    return engine


async def get_db():
    """Dependency for FastAPI - yields async session."""
    global session_factory
    if session_factory is None:
        from app.config import settings
        init_db(settings.database_url)
    async with session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
