from textual.app import App, ComposeResult
from textual.containers import Container, VerticalScroll
from textual.widgets import Header, Footer, Static, Tabs, Tab, DataTable, ListView, ListItem
from textual.binding import Binding
from textual.events import Mount
from .store import Store, get_statistics, select_by_category, search_scholars
from .widgets import ScholarCard, FilterPanel, StatusBar, CategoryTabs

class VoicesOfTruthApp(App):
    CSS = """
    Screen { background: $surface; }
    .title { text: bold; color: $primary; }
    .scholar-card { border: solid $primary; padding: 1; margin: 1; }
    #main-container { height: 100%; }
    #scholar-list { height: 100%; }
    """
    
    BINDINGS = [
        Binding("q", "quit", "Quit"),
        Binding("n", "next_tab", "Next Tab"),
        Binding("p", "prev_tab", "Prev Tab"),
    ]

    def __init__(self, db_path: str = None):
        super().__init__()
        self.store = Store()
        self.current_tab = 0
        self.active_filters = {"category": None, "language": None, "search": ""}

    def on_mount(self):
        self.store.load()
        self.store.subscribe(self.refresh)
        self.load_scholars()

    def load_scholars(self):
        self.store.load()

    def refresh(self):
        self.query_one("#scholar-list", ListView).refresh()

    def compose(self) -> ComposeResult:
        yield Header()
        yield CategoryTabs()
        yield StatusBar()
        with Container(id="main-container"):
            yield ListView(id="scholar-list")

    def watch_scholars(self):
        self.store.load()
        self.refresh()
    
    def action_next_tab(self):
        self.current_tab = (self.current_tab + 1) % 4
        self.tabs.active = str(self.current_tab)

    def action_prev_tab(self):
        self.current_tab = (self.current_tab - 1) % 4
        self.tabs.active = str(self.current_tab)


if __name__ == "__main__":
    app = VoicesOfTruthApp()
    app.run()