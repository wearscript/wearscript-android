import os
import base64

class PicarusClientLocal(object):
    
    def __init__(self, table_dirs):
        self.table_dirs = dict(table_dirs)
        self.table_rows = {table: map(base64.urlsafe_b64decode, os.listdir(self.table_dirs[table]))
                           for table in table_dirs}
        for rows in self.table_rows.values():
            rows.sort()
    
    def _row_dir(self, table, row):
        return os.path.join(self.table_dirs[table], base64.urlsafe_b64encode(row))

    def _column_file(self, table, row, column):
        return os.path.join(self._row_dir(table, row), base64.urlsafe_b64encode(column))
    
    def get_row(self, table, row, columns):
        row_dir = self._row_dir(table, row)
        out = {}
        for column in columns:
            column_file = self._column_file(table, row, column)
            if os.path.exists(column_file):
                out[column] = open(column_file, 'rb').read()
        return out
     
    def scanner(self, table, start_row, stop_row, columns=()):
        rows = self.table_rows[table]
        start_ind = bisect.bisect_left(start_row, rows) if start_row is not None else 0
        stop_ind = bisect.bisect_left(stop_row, rows) if stop_row is not None else len(rows)
        for row in rows[start_ind:stop_ind]:
            yield row, self.get_row(table, row, columns)
