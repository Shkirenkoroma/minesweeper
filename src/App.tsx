import { FC, useState } from 'react';
import './App.css';

const Mine = -1;

function createField(size: number) {
  const field: number[] = new Array(size * size).fill(0);

  function inc(x: number, y: number) {
    if (x >= 0 && x < size && y >= 0 && y < size) {
      if (field[y * size + x] === Mine) return;
      field[y * size + x] += 1;
    }
  }

  for (let i = 0; i < size; ) {
    const x = Math.floor(Math.random() * size);
    const y = Math.floor(Math.random() * size);

    if (field[y * size + x] === Mine) continue;

    field[y * size + x] = Mine;

    i += 1;

    inc(x + 1, y);
    inc(x - 1, y);
    inc(x, y + 1);
    inc(x, y - 1);
    inc(x + 1, y - 1);
    inc(x - 1, y - 1);
    inc(x + 1, y + 1);
    inc(x - 1, y + 1);
  }

  return field;
}

const App: FC = (): JSX.Element => {
  const size = 10;
  const dimension = new Array(size).fill(null);

  const [field, setField] = useState<number[]>(() => createField(size));

  return (
    <div className="App">
      {dimension.map((_, y) => {
        return (
          <div key={y} style={{ display: 'flex' }}>
            {dimension.map((_, x) => {
              return (
                <div
                  key={x}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 24,
                    height: 24,
                    margin: 1,
                    backgroundColor: '#BEB',
                  }}
                >
                  {field[y * size + x]}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default App;
