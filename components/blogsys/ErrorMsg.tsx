export default function ErrorMsg({ errMsg }: { errMsg: string }) {
  return (
    <div className="h-40 flex items-center justify-center text-red-500 wrap-anywhere">
      {errMsg}
    </div>
  );
}
