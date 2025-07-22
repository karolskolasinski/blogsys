import AvatarIcon from "@/public/icons/avatar.svg";

type AvatarProps = {
  src: string | null;
};

export default function Avatar(props: AvatarProps) {
  const { src } = props;

  return (
    <div
      className="w-36 h-36 flex items-center justify-center bg-gray-200 rounded-full bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: src ? `url(${src})` : undefined,
        borderColor: "transparent",
      }}
    >
      {!src && <AvatarIcon className="w-3/4 h-3/4 fill-white" />}
    </div>
  );
}
