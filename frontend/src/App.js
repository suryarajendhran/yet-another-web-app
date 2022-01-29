import logo from './logo.svg';
import './App.css';
import data from './data.json';

function App() {
  console.log(data);
  return (
    <div className="App">
      <header className="App-header">
        <div className="gallery">
          {data.map(({title, position, type}) => {
            return (
              <div className="card">
                {title}
              </div>
            )
          })}
        </div>
      </header>
    </div>
  );
}

export default App;
