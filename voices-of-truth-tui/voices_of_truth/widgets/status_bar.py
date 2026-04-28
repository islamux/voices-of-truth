from textual.widgets import Static

class StatusBar(Static):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def render(self):
        return "[b]Voices of Truth[/b] | Scholar Directory | Press ? for help"