import AvatarIcon from "@/public/icons/blogsys/avatar.svg";

type AvatarProps = {
  src?: string;
  className?: string;
};

export default function Avatar(props: Readonly<AvatarProps>) {
  const { src, className } = props;

  return (
    <div
      className={`${className} flex items-center justify-center bg-gray-200 rounded-full bg-cover bg-center bg-no-repeat`}
      style={{
        backgroundImage: src ? `url(${src})` : undefined,
        borderColor: "transparent",
      }}
    >
      {!src && <AvatarIcon className="w-3/4 h-3/4 fill-white" />}
    </div>
  );
}
