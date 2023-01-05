import { useEffect, useRef, useState } from 'react'

type ListItem = {
  id: string;
  value: string;
  listId: string;
  createdAt: number;
}

const Item = (props: {item?: ListItem, onButtonClick: (id: string) => Promise<void>}, listId: string) => {
  const inputRef = useRef<any>(null);

  return (
    <div className='
        flex 
        w-full 
        max-w-[500px] 
        h-24
        bg-slate-400
        border-2 
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
              <button onClick={() => props.onButtonClick(props.item!.id)} className='border-2 min-w-[90px] rounded-md bg-slate-600 text-slate-300 p-3'>Remove</button>
            </div>
          </div>
        </>
      )
      }

      {props.item === undefined && (
        <>
          <div className='flex grow justify-center'>
            <div className='flex w-full justify-start px-4'>
              <input ref={inputRef} className='w-full text-xl p-2 rounded' type="text"/>
            </div>
          </div>
          <div className='flex shrink'>
            <div className='flex'>
              <button 
                onClick={() => {
                  props.onButtonClick(inputRef.current.value)
                  inputRef.current.value = "";
                  }} 
                className='border-2 min-w-[90px] rounded-md bg-slate-600 border-rose-700 text-slate-300 p-3'>
                  Add
              </button>
            </div>
          </div>
        </>
      )
      }

    </div>
  )
}

const fetchList = async (listId: string): Promise<ListItem[]> => {
  const response = await fetch(import.meta.env.VITE_API_URL+`?list_id=${listId}`)
  const list = await response.json();
  console.log(list)
  return list.map((l: { id: string, value: string, list_id: string, created_at: number }) => ({
    id: l.id,
    value: l.value,
    listId: l.list_id,
    createdAt: l.created_at,
  }))
}

const createItem = async ({value, listId}: { value: string, listId: string}): Promise<void> => {
  // TODO: Actually create an item
  const payload = {
    value,
    listId,
  }

  await fetch(import.meta.env.VITE_API_URL+`?list_id=${listId}`, {
    method: "post",
    body: JSON.stringify(payload)
  })  

  return;
}

const deleteItem = async (listId: string, itemId: string): Promise<void> => {
  await fetch(import.meta.env.VITE_API_URL+`?list_id=${listId}`, {
    method: "delete",
    body: JSON.stringify({
      id: itemId
    })
  })  
  return;
}


function App() {

  const queryParams = new URLSearchParams(window.location.search)
  const listId = queryParams.get("list_id")

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

  const onDelete = async (itemId: string) => {
    if (!listId) {
      console.warn("No list id")
      return;
    }
    // Delete an item and trigger a list fetch?
    await deleteItem(listId, itemId);
    await setListAsync();
  }

  const onCreate = async (itemValue: string) => {
    if (!listId) {
      console.warn("No list id")
      return;
    }
    // Create an item and trigger a list fetch?

    await createItem({value: itemValue, listId})

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
    <div className="flex flex-col justify-center w-screen h-screen bg-purple-900">
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