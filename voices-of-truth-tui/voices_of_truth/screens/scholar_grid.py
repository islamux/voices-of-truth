from textual.screen import Screen
from textual.widgets import ListView, ListItem, Static

class ScholarGridScreen(Screen):
    def __init__(self, store, **kwargs):
        super().__init__(**kwargs)
        self.store = store

    def compose(self):
        yield ListView(id="scholar-list-view")

    def on_mount(self):
        self.refresh_scholars()

    def refresh_scholars(self):
        list_view = self.query_one("#scholar-list-view", ListView)
        list_view.clear()
        if self.store.db:
            for scholar in self.store.db.scholars[:50]:
                list_view.append(ListItem(Static(f"{scholar.name.get('en', 'Unknown')} - {scholar.name.get('ar', '')}")))