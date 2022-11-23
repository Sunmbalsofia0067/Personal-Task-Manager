import { useEffect, useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Text, Paper, Badge, Modal, Textarea, Button } from '@mantine/core'
import { HeaderMenuColored } from '../../components/Header'
import { isEqual } from 'lodash'
import axios from 'axios'
const grid = 8

const getItems = (count, offset = 0) =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${Math.random() * 100000 + offset}`,
    content: `item ${k + offset}`
  }))

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'grey',

  // styles we need to apply on draggables
  ...draggableStyle
})

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: grid,
  width: 250
})

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source)
  const destClone = Array.from(destination)
  const [removed] = sourceClone.splice(droppableSource.index, 1)

  destClone.splice(droppableDestination.index, 0, removed)

  const result = {}
  result[droppableSource.droppableId] = sourceClone
  result[droppableDestination.droppableId] = destClone

  return result
}

function Homepage () {
  const [items, setItems] = useState(getItems(0))
  const [doneItems, setDoneItems] = useState(getItems(0))
  const [inProgressItems, setInProgessItems] = useState(getItems(0))
  const [openModel, setOpenModal] = useState(false)
  const [taskToUpdate, setTaskToUpdate] = useState({})
  const [mainTask, setMainTask] = useState({})
  const [isValidInput, setIsValidInput] = useState(false)

  useEffect(() => {
    const getAllTasks = async userId => {
      const token = localStorage.getItem('access_token')
      const myUser = await axios.get(`http://localhost:3001/tasks`, {
        headers: {
          authorization: `Bearer ${token}`
        }
      })
      const task = myUser.data
      const inprogress = [],
        doneArray = [],
        pendingArray = []

      task.forEach(element => {
        if (element.status === 'In-Progress') {
          inprogress.push(element)
        } else if (element.status === 'done') {
          doneArray.push(element)
        } else {
          pendingArray.push(element)
        }
      })
      setInProgessItems(inprogress)
      setItems(pendingArray)
      setDoneItems(doneArray)
    }

    const user = JSON.parse(localStorage.getItem('user'))
    getAllTasks(user.id)
  }, [])

  const id2List = {
    todos: 'items',
    done: 'done',
    inProgress: 'inProgress'
  }
  const getListInfo = id => {
    const listInfo = {}
    const list = id2List[id]
    switch (list) {
      case 'items':
        listInfo['dataArr'] = items
        listInfo['updateData'] = setItems
        break
      case 'done':
        listInfo['dataArr'] = doneItems
        listInfo['updateData'] = setDoneItems
        break
      case 'inProgress':
        listInfo['dataArr'] = inProgressItems
        listInfo['updateData'] = setInProgessItems
        break
      default:
    }

    return listInfo
  }

  const onDragEnd = result => {
    const { source, destination } = result
    if (!destination) {
      return
    }

    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        getListInfo(source.droppableId).dataArr,
        source.index,
        destination.index
      )
      getListInfo(source.droppableId).updateData(items)
    } else {
      const result = move(
        getListInfo(source.droppableId).dataArr,
        getListInfo(destination.droppableId).dataArr,
        source,
        destination
      )
      Object.keys(result).map(key => {
        getListInfo(key).updateData(result[key])
      })
    }
  }
  const updateUiTodos = data => {
    setItems([...items, data])
  }

  const UpdateTask = async () => {
    const taskId = taskToUpdate.id
    const token = localStorage.getItem('access_token')
    const updatedTaskResponse = await axios.patch(
      `http://localhost:3001/tasks/${taskId}`,
      taskToUpdate,
      {
        headers: {
          authorization: `Bearer ${token}`
        }
      }
    )
    const updatedTask = updatedTaskResponse.data

    const updatedTaskStatus = updatedTask.status
    const updateUI = {
      arrayToUpdate: [],
      updateArrayFunction: () => {}
    }
    if (updatedTaskStatus === 'done') {
      updateUI.arrayToUpdate = doneItems
      updateUI.updateArrayFunction = setDoneItems
    } else if (updatedTaskStatus === 'In-Progress') {
      updateUI.arrayToUpdate = inProgressItems
      updateUI.updateArrayFunction = setInProgessItems
    } else {
      updateUI.arrayToUpdate = items
      updateUI.updateArrayFunction = setItems
    }

    const arrayIndexToUpdate = updateUI.arrayToUpdate.findIndex((element)=>((element.id === updatedTask.id)))
    updateUI.arrayToUpdate.splice(arrayIndexToUpdate,1, updatedTask)
    updateUI.updateArrayFunction([...updateUI.arrayToUpdate])
    setOpenModal(false)
  }

  useEffect(() => {
    if (!isEqual(taskToUpdate, mainTask)) {
      console.log('In Use effect with dependency array ')
      setIsValidInput(true)
    } else setIsValidInput(false)
  }, [taskToUpdate.title, taskToUpdate.description])

  return (
    <div>
      <HeaderMenuColored updateUiTodos={updateUiTodos} items={items} />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Modal opened={openModel} onClose={() => setOpenModal(false)}>
          <Textarea
            label='Title'
            value={taskToUpdate.title}
            onChange={event => {
              const value = event.target.value
              setTaskToUpdate({ ...taskToUpdate, title: value })
              setIsValidInput(true)
            }}
          />
          <Textarea
            label='Description'
            value={taskToUpdate.description}
            onChange={event => {
              const value = event.target.value
              setTaskToUpdate({ ...taskToUpdate, description: value })
              setIsValidInput(true)
            }}
          />
          <Button
            mt='sm'
            type='submit'
            radius='md'
            disabled={!isValidInput}
            onClick={UpdateTask}
          >
            Save
          </Button>
        </Modal>
        <div style={{ display: 'flex' }}></div>
        <DragDropContext onDragEnd={onDragEnd}>
          <div>
            <Paper
              shadow='xl'
              radius='sm'
              p='xs'
              withBorder
              style={{ marginBottom: '10px', marginRight: '10px' }}
            >
              <Text>
                {' '}
                TODOs <Badge>{items.length}</Badge>{' '}
              </Text>
            </Paper>
            <Droppable droppableId='todos'>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  {items.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={`${item.id}`}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                          onClick={event => {
                            event.preventDefault()
                            setTaskToUpdate(item)
                            setMainTask(item)
                            setOpenModal(true)
                          }}
                        >
                          {item.title}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
          <div>
            <Paper
              shadow='xl'
              radius='sm'
              p='xs'
              withBorder
              style={{ marginBottom: '10px', marginRight: '10px' }}
            >
              <Text>
                {' '}
                In-progress <Badge>{inProgressItems.length}</Badge>{' '}
              </Text>
            </Paper>
            <Droppable droppableId='inProgress'>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  {inProgressItems.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={`${item.id}`}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                          onClick={event => {
                            event.preventDefault()
                            setTaskToUpdate(item)
                            setMainTask(item)
                            setOpenModal(true)
                          }}
                        >
                          {item.title}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
          <div>
            <Paper
              shadow='xl'
              radius='sm'
              p='xs'
              withBorder
              style={{ marginBottom: '10px' }}
            >
              <Text>
                {' '}
                Completed <Badge>{doneItems.length}</Badge>{' '}
              </Text>
            </Paper>
            <Droppable droppableId='done'>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  {doneItems.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={`${item.id}`}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                          onClick={event => {
                            event.preventDefault()
                            setTaskToUpdate(item)
                            setMainTask(item)
                            setOpenModal(true)
                          }}
                        >
                          {item.title}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </DragDropContext>
      </div>
    </div>
  )
}
export default Homepage
