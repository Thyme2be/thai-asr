const Transcript = ({ transcribeText }: { transcribeText: string | null}) => {
  return (
    <section className=" flex justify-center mt-8 ">
      <div className=" card w-1/2 p-5 ">
        <h1 className=" text-center text-4xl text-blue-700 font-bold mb-2 ">Transcript</h1>
        <p className=" text-xl ">{transcribeText}</p>
      </div>
    </section>
  );
};

export default Transcript;
