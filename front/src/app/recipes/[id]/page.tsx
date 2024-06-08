export default async function Page({
  params,
}: {
  params: { id : string };
}) {
  return (
    <>
      <div className="flex flex-wrap justify-center p-6 bg-white min-h-screen ml-64">
        this is {params.id}th receptだよ～
      </div>
    </>
  )
}