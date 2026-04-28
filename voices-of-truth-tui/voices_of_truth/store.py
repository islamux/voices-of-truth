from pydantic import BaseModel
from typing import Optional, Callable, List, Any
from datetime import datetime
import json
import os

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'scholars-db.json')

class Country(BaseModel):
    id: int
    en: str
    ar: str

class Category(BaseModel):
    id: int
    en: str
    ar: str

class Scholar(BaseModel):
    id: int
    name: dict[str, str]
    socialMedia: list[dict[str, Any]]
    countryId: int
    categoryId: int
    language: list[str]
    avatarUrl: str
    bio: Optional[dict[str, str]] = None

class ScholarStore(BaseModel):
    countries: list[Country]
    specializations: list[Any]
    scholars: list[Scholar]
    categories: list[Category]
    metadata: dict[str, str]

class Store:
    def __init__(self):
        self._db: Optional[ScholarStore] = None
        self._loading = False
        self._error: Optional[str] = None
        self._subscribers: List[Callable] = []

    def load(self) -> ScholarStore:
        self._loading = True
        try:
            if os.path.exists(DB_PATH):
                with open(DB_PATH, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    self._db = ScholarStore(**data)
            else:
                self._db = ScholarStore(
                    countries=[],
                    specializations=[],
                    scholars=[],
                    categories=[],
                    metadata={"last_updated": "", "version": "1.0.0"}
                )
        except Exception as e:
            self._error = str(e)
            self._db = ScholarStore(
                countries=[],
                specializations=[],
                scholars=[],
                categories=[],
                metadata={"last_updated": "", "version": "1.0.0"}
            )
        finally:
            self._loading = False
            self._notify()
        return self._db

    def set_db(self, data: dict):
        self._db = ScholarStore(**data)
        self._notify()

    def subscribe(self, callback):
        self._subscribers.append(callback)

    def _notify(self):
        for cb in self._subscribers:
            cb()

    @property
    def db(self) -> Optional[ScholarStore]:
        return self._db

    @property
    def error(self) -> Optional[str]:
        return self._error


def select_by_category(store: Store, category_id: int) -> list[Scholar]:
    if not store.db:
        return []
    return [s for s in store.db.scholars if s.categoryId == category_id]

def select_by_language(store: Store, lang: str) -> list[Scholar]:
    if not store.db:
        return []
    return [s for s in store.db.scholars if lang in s.language]

def select_by_country(store: Store, country_id: int) -> list[Scholar]:
    if not store.db:
        return []
    return [s for s in store.db.scholars if s.countryId == country_id]

def search_scholars(store: Store, query: str) -> list[Scholar]:
    if not store.db:
        return []
    q = query.lower()
    return [s for s in store.db.scholars
            if q in s.name.get('en', '').lower() or q in s.name.get('ar', '').lower()]

def get_statistics(store: Store) -> dict:
    if not store.db:
        return {}
    db = store.db
    return {
        "total_scholars": len(db.scholars),
        "by_category": {c.en: len([s for s in db.scholars if s.categoryId == c.id]) for c in db.categories},
        "by_language": dict(
            zip(*[(l, len([s for s in db.scholars if l in s.language])) 
                  for l in set(sum((s.language for s in db.scholars), []))])
        ) if db.scholars else {},
        "by_country": {c.en: len([s for s in db.scholars if s.countryId == c.id]) for c in db.countries}
    }