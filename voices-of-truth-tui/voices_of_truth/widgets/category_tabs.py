from textual.widgets import Tabs, Tab
from textual.containers import Horizontal

class CategoryTabs(Horizontal):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self._tabs = None

    def compose(self):
        yield Tabs(
            Tab("All", id="tab-all"),
            Tab("Quran", id="tab-quran"),
            Tab("Fiqh", id="tab-fiqh"),
            Tab("History", id="tab-history"),
            Tab("Thought", id="tab-thought"),
            id="category-tabs"
        )