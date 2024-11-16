import { useState, useEffect } from 'react'
import buttonsJson from './assets/buttons.json'
import './App.css'

interface Button {
  type: string;
  name: string;
}

function App() {
  const AVAILABLE_COLUMN_TYPE = "_available_"
  const [btns, setBtns] = useState<Map<string, Button[]>>(new Map())
  const [btnsJson, setBtnsJson] = useState<Button[]>([])

  useEffect(() => {
    setBtns(new Map())
    setBtnsJson(buttonsJson)
  }, [])

  useEffect(() => {
    btnsJson.map((button: Button) => {
      addToBtns(AVAILABLE_COLUMN_TYPE, button)
      addToBtns(button.type)
    })
  }, [btnsJson])

  const addToBtns = (type: string, button: Button | null = null) => {
    // Clone the map to trigger a re-render, since Map is not reactive

    setBtns(prevMap => {
      const newMap = new Map(prevMap); // Clone the previous map
      if (!newMap.has(type)) {
        newMap.set(type, []); // If the key doesn't exist, initialize with an empty array
      }
      if (button !== null) {
        const column = newMap.get(type);
        if (column && column.indexOf(button)<0) {
          column.push(button); // Push new value into the array at the specified key
        }
      }
      return newMap;
    });
  };

  const removeFromBtns = (type: string, button: Button) => {
    setBtns((prevMap) => {
      const newMap = new Map(prevMap); // Clone the previous map
      const column = newMap.get(type); // Get the array associated with the key

      if (column) {
        // Remove the item from the array if it exists
        const index = column.indexOf(button);
        if (index !== -1) {
          column.splice(index, 1); // Remove the item from the array
        }
      }

      return newMap;
    });
  };

  const clickBtn = (button : Button, fromType:string) => {

    removeFromBtns(fromType,button);
    addToBtns(fromType === AVAILABLE_COLUMN_TYPE ? button.type : AVAILABLE_COLUMN_TYPE, button);

    if (fromType === AVAILABLE_COLUMN_TYPE) {

      setTimeout(function() {
        clickBtn(button, button.type);
      }, 5000);

    }
  }

  const getClassName = (type : string) => {
    let className = 'text-white font-semibold py-2 px-4 ';
      
    if (type === 'Fruit') {
      className += 'bg-orange-400';
    } else {
      className += 'bg-green-500';
    }

    return className;
  }

  const getBtnClassName = (type : string) => {
    let className = getClassName(type) + ' rounded-lg transition-all duration-300 sm:px-6 md:px-8 lg:px-10 ';

    if (type === 'Fruit') {
      className += 'hover:bg-orange-500';
    } else {
      className += 'hover:bg-green-600';
    }

    return className;
  }

  const getColumnTitleClassName = (type : string) => {
    let className = getClassName(type) + ' w-80';
      
    return className;
  }

  const showAvailableColumn = (buttons:Button[]) => {
    return (
      <div key={AVAILABLE_COLUMN_TYPE}>
        {showButtons(buttons, AVAILABLE_COLUMN_TYPE)}
      </div>
    )
  }

  const showOtherColumn = (buttons:Button[], type:string) => {
    let className = getColumnTitleClassName(type);

    return (
      <div className="h-100" key={type}>
        <div className={className}>{type}</div>
        {showButtons(buttons, type)}
      </div>      
    )
  }

  const showButtons = (buttons:Button[], fromType:string) => {
    return (
      <ul>
        {buttons.map(button => {
          let className = getBtnClassName(button.type);

          return (
            <li key={button.type+","+button.name} className="py-2">
              <button onClick={() => clickBtn(button, fromType)} className={className}>
                {button.name}
              </button>
            </li>
          )
        })}
      </ul>
    )
  }

  return (
      <div className="flex justify-between" key={1}>
        {Array.from(btns).map(([type, buttons]) => {

          if (type === AVAILABLE_COLUMN_TYPE) { // First Column
            return showAvailableColumn(buttons)
          } else { // Other Columns
            return showOtherColumn(buttons, type)
          }
          
        })}
      </div>
  )
}

export default App
