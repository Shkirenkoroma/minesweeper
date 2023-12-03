import { FC, ReactNode, useMemo, useState } from 'react';
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

enum Mask {
  Transparent,
  Fill,
  Flag,
  Question,
}

const mapMaskToView: Record<Mask, ReactNode> = {
  [Mask.Transparent]: null,
  [Mask.Fill]: 'cle',
  [Mask.Flag]: 'fla',
  [Mask.Question]: '?',
};

const App: FC = (): JSX.Element => {
  const size = 10;
  const dimension = new Array(size).fill(null);

  const [death, setDeath] = useState<boolean>(false);
  const [field, setField] = useState<number[]>(() => createField(size));
  const [mask, setMask] = useState<Mask[]>(() =>
    new Array(size * size).fill(Mask.Fill)
  );

  const win = useMemo(() => !field.some(
  (f, i) => 
  f === Mine && mask[i] !== Mask.Flag 
  && mask[i] !== Mask.Transparent
  ), 
  [field, mask]
  );

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
                    backgroundColor: death ? '#FAA' : win ? '#FFB' : '#BEB',
                  }}
                  onClick={() => {
                    if( win || death ) return;
                    if (mask[y * size + x] === Mask.Transparent) return;

                    const clearing: [number, number][] = [];

                    function clear(x: number, y: number) {
                      if (x >= 0 && x < size && y >= 0 && y < size) {
                        if (mask[y * size + x] === Mask.Transparent) return;
                        clearing.push([x, y]);
                      }
                    }

                    clear(x, y);

                    while (clearing.length) {
                      const [x, y] = clearing.pop()!!;

                      mask[y * size + x] = Mask.Transparent;

                      if (field[y * size + x] !== 0) continue;

                      clear(x + 1, y);
                      clear(x - 1, y);
                      clear(x, y + 1);
                      clear(x, y - 1);
                    }

                    if (field[y * size + x] === Mine) {
                      mask.forEach((_, i) => (mask[i] = Mask.Transparent));

                      setDeath(true);
                    }

                    setMask((prev) => [...prev]);
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    if( win || death ) return;

                    if (mask[y * size + x] === Mask.Transparent) return;

                    if (mask[y * size + x] === Mask.Fill) {
                      mask[y * size + x] = Mask.Flag;
                    } else if (mask[y * size + x] === Mask.Flag) {
                      mask[y * size + x] = Mask.Question;
                    } else if (mask[y * size + x] === Mask.Question) {
                      mask[y * size + x] = Mask.Fill;
                    }
                    setMask((prev) => [...prev]);
                  }}
                >
                  {mask[y * size + x] !== Mask.Transparent
                    ? mapMaskToView[mask[y * size + x]]
                    : field[y * size + x] === Mine
                    ? 'x'
                    : field[y * size + x]}
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
