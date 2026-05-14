from textual.widgets import Input, Button
from textual.containers import Horizontal

class FilterPanel(Horizontal):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def compose(self):
        yield Input(placeholder="Search scholars...", id="search-input")
        yield Button("Clear", id="clear-filters")