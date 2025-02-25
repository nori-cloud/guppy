import LinkList from "../../../../../module/profile/link-list"

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-2xl font-bold">Profile {id}</h1>

      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Draggable Cards</h2>
        <p className="text-muted-foreground mb-4">
          Drag and drop these cards to reorder them. The order will be saved
          automatically.
        </p>

        <LinkList />
      </div>
    </div>
  )
}
