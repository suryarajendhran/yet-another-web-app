import ImageWithSpinner from "./ImageWithSpinner";
import("./Card.css");

function Card({
  title,
  type,
  position,
  id,
  index,
  openImage,
  switchPositions,
}) {
  const getImgUrl = (title) =>
    `https://fakeimg.pl/250x250/282c34/eae0d0/?retina=1&text=${title}`;
  return (
    <div
      style={{ order: position }}
      className="card"
      draggable="true"
      onClick={() => {
        openImage(title, type);
      }}
      onDragStart={(event) => {
        event.target.style.opacity = 0.4;

        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData(
          "text/plain",
          JSON.stringify({ title, type, position, index })
        );
      }}
      onDragEnd={(event) => {
        event.target.style.opacity = 1;
      }}
      onDragOver={(event) => {
        if (event.preventDefault) {
          event.preventDefault();
        }
        return false;
      }}
      onDrop={(event) => {
        event.stopPropagation();

        const drop = JSON.parse(event.dataTransfer.getData("text/plain"));
        switchPositions(drop.index, drop.position, index, position);

        console.log(`${drop.title} dropped on ${title}`);
      }}
    >
      <div className="card-overlay"></div>
      <span>{title}</span>
      <ImageWithSpinner imgUrl={getImgUrl(title)} />
    </div>
  );
}

export default Card;
