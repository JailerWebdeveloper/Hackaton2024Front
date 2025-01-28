const Home = () => {
  return (
    <>
      <div
        className="hero min-h-screen"
        style={{
          backgroundImage: "url(/BGupc.webp)",
        }}>
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-neutral-content text-center">
          <div className="max-w-md">
            <h1 className="mb-5  text-white text-5xl font-bold">Gestion de Proyectos</h1>
            <p className="mb-5 text-white">
             Hazle seguimiento y consulta tus proyectos universitarios
            </p>
          </div>
        </div>
      </div>
    </>);
}

export default Home;