import React, {useRef, useEffect} from 'react';
import SplatCanvas from './components/SplatCanvas';
import MovementHandler from "./components/movement";

function App() {
    const elementRef = useRef(null);

    useEffect(() => {
        if (elementRef.current) {
            new MovementHandler(elementRef.current);
        }
    }, []);
    return (
        <div className="App">
            <header className="App-header">
                <div ref={elementRef} id="movable-element" className="movable-element">Move Me</div>
            </header>
        </div>
    );
}

export default App;
