import { getMajors } from "./actions";

export default async function Page() {
  const majors = await getMajors();

  return (
    <ul>
      {majors.map((major) => {
        return <li key={major.id}>{major.name}</li>;
      })}
    </ul>
  );
}
