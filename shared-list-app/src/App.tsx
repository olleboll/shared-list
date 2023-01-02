import { useEffect, useState } from 'react'
import { useInterval } from 'usehooks-ts'


type ListItem = {
  id: string;
  value: string;
  listId: string;
  createdAt: number;
}

const Item = (props: {item?: ListItem, onButtonClick: (id: string) => Promise<void>}, listId: string) => {
  return (
    <div className='
        flex 
        w-full 
        max-w-[500px] 
        h-24 
        bg-slate-400 
        border-2 
        border-rose-800 
        rounded 
        p-8 
        items-center 
        justify-start'
    >
      {props.item !== undefined && (
        <>
          <div className='flex grow justify-center'>
            <div className='flex w-full justify-start px-4'>
              <p className='text-xl'>{props.item?.value}</p>
            </div>
          </div>
          <div className='flex shrink'>
            <div className='flex'>
              <button onClick={() => props.onButtonClick(props.item!.id)} className='border-2 min-w-[90px] rounded-md bg-slate-900 text-slate-300 border-rose-800 p-3'>Remove</button>
            </div>
          </div>
        </>
      )
      }

      {props.item === undefined && (
        <>
          <div className='flex grow justify-center'>
            <div className='flex w-full justify-start px-4'>
              <input className='w-full text-xl p-2 rounded' type="text"/>
            </div>
          </div>
          <div className='flex shrink'>
            <div className='flex'>
              <button onClick={() => props.onButtonClick("value")} className='border-2 min-w-[90px] rounded-md bg-slate-900 text-slate-300 border-rose-800 p-3'>Add</button>
            </div>
          </div>
        </>
      )
      }

    </div>
  )
}

const fetchList = async (listId: string): Promise<ListItem[]> => {
  // TODO: Actually fetch the list
  await timeout(1000);
  return [
    {
      id: "test",
      value: "Pasta",
      listId: "test",
      createdAt: Date.now()
    },
    {
      id: "test2",
      value: "gurka",
      listId: "test",
      createdAt: Date.now()
    }
  ]
}

const createItem = async ({value, listId}: { value: string, listId: string}): Promise<void> => {
  // TODO: Actually create an item
return;
}

const deleteItem = async (itemId: string): Promise<void> => {
    // TODO: Actually delete the item
  return;
}


function App() {

  const queryParams = new URLSearchParams(window.location.search)
  const listId = queryParams.get("listId")

  const [list, setList] = useState<ListItem[]>([])

  const setListAsync = async () => {
    if (!listId) {
      console.warn("No list id")
      return;
    }
    const l = await fetchList(listId);
    setList(l)
  }

  useEffect(() => {
    if (list.length === 0) {
      setListAsync();
    }
  }, [list])

  useInterval(() => {
    if (list.length === 0) {
      setListAsync();
    }
  }, 5000)

  const onDelete = async (itemId: string) => {
    if (!listId) {
      console.warn("No list id")
      return;
    }
    // Delete an item and trigger a list fetch?

    await setListAsync();
  }

  const onCreate = async (itemValue: string) => {
    if (!listId) {
      console.warn("No list id")
      return;
    }
    // Create an item and trigger a list fetch?

    await setListAsync();
  }

  const items = list.map((item: ListItem) => {
    return (
      <div key={item.id} className='flex justify-center w-full mt-2'>
        <Item onButtonClick={onDelete} item={item}/>
      </div>
    )
  })

  return (
    <div className="flex flex-col justify-center w-screen h-screen bg-slate-900">
      <div className='flex flex-col justify-center'>
        {items}
      </div>
      <div className='flex flex-col justify-center mt-2'>
        <div className='flex justify-center w-full'>
          <Item onButtonClick={onCreate} />
        </div>
      </div>
    </div>
  )
}

export default App

const timeout = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));