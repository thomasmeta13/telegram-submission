import { BrowserRouter } from "react-router-dom";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { MiniAppContextProvider } from "./routes/MiniAppContextProvider";
import Router from "./routes/Router";
// import { SDKProvider } from '@telegram-apps/sdk-react';

function App() {
  const onDragEnd = (result: DropResult) => {
    // We'll implement this later
    console.log(result);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <BrowserRouter>
        <MiniAppContextProvider>
          <Router />
        </MiniAppContextProvider>
      </BrowserRouter>
    </DragDropContext>
  );
}

export default App;
