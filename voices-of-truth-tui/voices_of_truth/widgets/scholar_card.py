from textual.widgets import Static
from textual.message import Message

class ScholarCard(Static):
    def __init__(self, scholar, **kwargs):
        super().__init__(**kwargs)
        self.scholar = scholar

    def render(self):
        s = self.scholar
        name_en = s.name.get('en', 'Unknown')
        name_ar = s.name.get('ar', '')
        langs = ', '.join(s.language)
        return f"[b]{name_en}[/b]\n{name_ar}\nLanguages: {langs}\nID: {s.id}"