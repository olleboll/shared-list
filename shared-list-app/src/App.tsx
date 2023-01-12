import { useEffect, useRef, useState } from 'react'

type ListItem = {
  id: string;
  value: string;
  listId: string;
  urgent: boolean;
  createdAt: number;
}

const Item = (props: {item?: ListItem, onButtonClick: (id: string, urgent?: boolean) => Promise<void>}, listId: string) => {
  const inputRef = useRef<any>(null);

  const itemClasses = [
    "flex",
    "w-full",
    "max-w-[500px]", 
    "h-32",
    "bg-slate-400",
    "border-2",
    "rounded",
    "p-8",
    "items-center",
    "justify-start",
    (props.item?.urgent ? "border-rose-700" : "")
  ].join(" ")

  return (
    <div className={itemClasses}
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
            <div className='flex flex-col'>
              <button 
                onClick={() => {
                  props.onButtonClick(inputRef.current.value)
                  inputRef.current.value = "";
                  }} 
                className='border-2 min-w-[90px] rounded-md bg-slate-600 text-slate-300 p-3'>
                  Add
              </button>
              <button 
                onClick={() => {
                  props.onButtonClick(inputRef.current.value, true)
                  inputRef.current.value = "";
                  }} 
                className='mt-2 border-2 min-w-[90px] rounded-md bg-slate-600 border-rose-700 text-slate-300 p-3'>
                  Add Urgent
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
  return list.map((l: { id: string, value: string, list_id: string, created_at: number, urgent: boolean }) => ({
    id: l.id,
    value: l.value,
    listId: l.list_id,
    urgent: l.urgent,
    createdAt: l.created_at,
  })).sort((a: ListItem, b: ListItem) => a.urgent ? -1 : 1)
}

const createItem = async ({value, listId, urgent}: { value: string, listId: string, urgent: boolean}): Promise<void> => {
  // TODO: Actually create an item
  const payload = {
    value,
    listId,
    urgent
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
  const inputRef = useRef<any>(null);

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

  const onCreate = async (itemValue: string, urgent: boolean = false) => {
    if (!listId) {
      console.warn("No list id")
      return;
    }
    // Create an item and trigger a list fetch?

    await createItem({value: itemValue, listId, urgent})

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
      <div className="flex flex-col justify-center w-screen min-h-screen bg-purple-700">
        <div className='h-full py-[50px]'>
          {!listId && (
            <div className='flex flex-col justify-center items-center'>
              <div className='flex flex-col justify-center max-w-[500px] h-32 bg-slate-400 border-2 rounded p-8'>
                  <div className='flex justify-center w-full'>
                    <div className='flex grow justify-center'>
                      <div className='flex w-full justify-start px-4'>
                        <input ref={inputRef} className='w-full text-xl p-2 rounded' type="text"/>
                      </div>
                    </div>
                    <div className='flex shrink'>
                      <div className='flex flex-col'>
                        <button 
                          onClick={() => {
                            location.href = location.href + `?list_id=${inputRef.current.value}`
                            }} 
                          className='border-2 min-w-[90px] rounded-md bg-slate-600 text-slate-300 p-3'>
                            Goto list
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          )}
          {listId && (
            <>
              <div className='flex flex-col justify-center'>
                {items}
              </div>
              <div className='flex flex-col justify-center mt-2'>
                <div className='flex justify-center w-full'>
                  <Item onButtonClick={onCreate} />
                </div>
              </div>
            </>
          )}
        </div>
    </div>
  )
}

export default App

const timeout = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));