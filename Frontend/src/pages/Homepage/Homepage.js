import { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Text, Paper, Badge } from '@mantine/core'
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
  const [items, setItems] = useState(getItems(10))
  const [doneItems, setDoneItems] = useState(getItems(5))
  const [inProgressItems, setInProgessItems] = useState(getItems(6))

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

    console.log(result)

    // dropped outside the list
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
        getListInfo(destination.droppableId),
        source,
        destination
      )

      console.log(result)
      setItems(result.todos)
      setDoneItems(result.done)
      setInProgessItems(result.inProgress)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <div style={{ display: 'flex' }}></div>
        <DragDropContext onDragEnd={onDragEnd}>
          <div>
            <Paper shadow='xl' radius='lg' p='xs' withBorder>
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
                      draggableId={item.id}
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
                        >
                          {item.content}
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
            <Paper shadow='xl' radius='lg' p='xs' withBorder>
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
                      draggableId={item.id}
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
                        >
                          {item.content}
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
            <Paper shadow='xl' radius='lg' p='xs' withBorder>
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
                      draggableId={item.id}
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
                        >
                          {item.content}
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
