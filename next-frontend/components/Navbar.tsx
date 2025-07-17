import NavigateButton from "./NavigateButton";

const Navbar = () => {
  return (
    <>
      <header className=" h-32 bg-blue-700 flex flex-col justify-center items-center gap-2 text-white relative z-1 ">
        <h1 className=" text-5xl font-bold ">Thai-ASR webservice</h1>
        <p className=" text-lg ">
          Automatic Recognition Speech for Thai langugae!
        </p>
      </header>
      <NavigateButton />
    </>
  );
};

export default Navbar;
