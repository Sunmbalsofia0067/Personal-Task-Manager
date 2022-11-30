import {
  createStyles,
  Header,
  Menu,
  Modal,
  Textarea,
  Button,
  Group,
  Center,
  TextInput,
  Burger,
  useMantineTheme,
  Container
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import {
  IconChevronDown,
  IconSearch,
} from '@tabler/icons'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const useStyles = createStyles(theme => ({
  header: {
    backgroundColor: theme.fn.variant({
      variant: 'filled',
      color: theme.primaryColor
    }).background,
    borderBottom: 0
  },

  inner: {
    height: 56,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  links: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none'
    }
  },

  burger: {
    [theme.fn.largerThan('sm')]: {
      display: 'none'
    }
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: '8px 12px',
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.white,
    fontSize: theme.fontSizes.sm,
    fontWeight: 500
  },

  search: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none'
    }
  },

  linkLabel: {
    marginRight: 5
  }
}))
const links = [
  {
    link: '',
    label: 'All Tasks'
  },
  {
    link: '',
    label: 'Add Task'
  },
  {
    link: '',
    label: 'Logout'
  }
]

export function HeaderMenuColored (props) {
  const [opened, { toggle }] = useDisclosure(false)
  const { classes } = useStyles()
  const [openModel, setOpenModal] = useState(false)
  const [isValidData, setIsValidData] = useState(false)
  const [newTaskData, setNewTaskData] = useState({
    title: '',
    description: ''
  })
  const theme = useMantineTheme()
  const navigate = useNavigate()

  const AddTask = async () => {
    const token = localStorage.getItem('access_token')
    const newData = await axios.post(
      'http://localhost:3001/newtask',
      newTaskData,
      {
        headers: {
          authorization: `Bearer ${token}`
        }
      }
    )
    setNewTaskData({
      title: '',
      description: ''
    })
    props.updateUiTodos(newData.data)
    setOpenModal(false)
  }

  const items = links.map(link => {
    const menuItems = link.links?.map(item => (
      <Menu.Item key={item.link}>{item.label}</Menu.Item>
    ))

    if (menuItems) {
      return (
        <div>
          <Menu key={link.label} trigger='hover' exitTransitionDuration={0}>
            <Menu.Target>
              <a
                href={link.link}
                className={classes.link}
                onClick={event => {
                  event.preventDefault()
                }}
              >
                <Center>
                  <span className={classes.linkLabel}>{link.label}</span>
                  <IconChevronDown size={12} stroke={1.5} />
                </Center>
              </a>
            </Menu.Target>
            <Menu.Dropdown>{menuItems}</Menu.Dropdown>
          </Menu>
        </div>
      )
    }

    return (
      <a
        key={link.label}
        href={link.link}
        className={classes.link}
        onClick={event => {
          // event.preventDefault()
          if (link.label === 'Add Task') {
            event.preventDefault()
            setOpenModal(true)
          } else if (link.label === 'All Tasks') navigate('/')
          else {
            localStorage.clear()
            navigate('/login')
          }
        }}
      >
        {link.label}
      </a>
    )
  })

  useEffect(() => {
    if (newTaskData.title.length > 6 && newTaskData.description.length > 6) {
      setIsValidData(true)
    }
  }, [newTaskData.title, newTaskData.description])

  return (
    <Header height={70} className={classes.header} mb={10} p={10}>
      <Container>
        <Modal
          opened={openModel}
          onClose={() => {
            setNewTaskData({
              title: '',
              description: ''
            })
            setOpenModal(false)
          }}
          title=<h3>Add Task</h3>
        >
          <Textarea
            placeholder='Title'
            label='Title'
            withAsterisk
            value={newTaskData.title}
            onChange={event => {
              const value = event.target.value
              setNewTaskData({
                ...newTaskData,
                title: value
              })
            }}
          />
          <Textarea
            placeholder='Write your text here.'
            label='Description'
            withAsterisk
            value={newTaskData.description}
            onChange={event => {
              const value = event.target.value
              setNewTaskData({
                ...newTaskData,
                description: value
              })
            }}
          />
          <Button
            mt='sm'
            type='submit'
            radius='md'
            disabled={!isValidData}
            onClick={AddTask}
          >
            Add
          </Button>
        </Modal>
        <div className={classes.inner}>
          <h1>Task Manager</h1>
          <TextInput
          icon={<IconSearch size={18} stroke={1.5} />}
          radius='xl'
          size='md'
          value = {props.searchBarText}
          onChange={(event)=>{
            const value = event.target.value
            props.setSearchBarText(value)
          }}
          placeholder='Search Task'
          rightSectionWidth={40}
          {...props}
        />
          <Group spacing={5} className={classes.links}>
            {items}
          </Group>
          <Burger
            opened={opened}
            onClick={toggle}
            className={classes.burger}
            size='sm'
            color='#fff'
          />
        </div>
      </Container>
    </Header>
  )
}
