import Login from "@/pages/public/login";

const App = () => {
  console.log(import.meta.env.VITE_APP_ID_ENTITY);

  return (
    <div>
      <Login></Login>
    </div>
  );
};

export default App;
