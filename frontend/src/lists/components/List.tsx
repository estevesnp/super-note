type ListProps = {
  name: string;
  description: string;
};

export default function List({ name, description }: ListProps) {
  return (
    <div class="list">
      <p>Name: {name}</p>
      <p>Description: {description}</p>
    </div>
  );
}
