import handleFormSubmit from "~~/app/server-actions/exercises/handleSubmit";

export default async function Exercise() {
  return (
    <div>
      <h1>Submit your solution by giving the address to your deployed contract</h1>

      <form action={handleFormSubmit}>
        <div>
          <label htmlFor="contactAddress">Contract address:</label>
          <input type="text" id="contractAddress" name="contractAddress" required />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
