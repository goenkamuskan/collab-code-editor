import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

function Lobby({ user, onEnterRoom }) {
  const [rooms, setRooms] = useState([])
  const [newRoomName, setNewRoomName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRooms()
  }, [])

  const fetchRooms = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setRooms(data)
    setLoading(false)
  }

  const handleCreateRoom = async (e) => {
    e.preventDefault()
    if (!newRoomName.trim()) return

    const { data, error } = await supabase
      .from('rooms')
      .insert({ name: newRoomName.trim(), created_by: user.id })
      .select()
      .single()

    if (error) {
      alert(error.message)
      return
    }
    onEnterRoom(data.id)
  }

  return (
    <div className="h-screen bg-[#1e1e1e] text-[#d4d4d4] flex flex-col items-center pt-20">
      <h1 className="text-xl font-semibold text-white mb-1">CollabCode</h1>
      <p className="text-sm text-[#888] mb-8">{user.email}</p>

      <form onSubmit={handleCreateRoom} className="flex gap-2 mb-8">
        <input
          type="text"
          placeholder="New room name"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
          className="bg-[#3e3e3e] text-white text-sm px-3 py-2 rounded outline-none w-64"
        />
        <button
          type="submit"
          className="bg-violet-600 hover:bg-violet-700 text-white text-sm px-4 py-2 rounded"
        >
          Create
        </button>
      </form>

      <div className="w-96">
        <div className="text-xs text-[#666] uppercase tracking-wide mb-2">Existing Rooms</div>
        {loading && <p className="text-[#666] text-sm">Loading...</p>}
        {!loading && rooms.length === 0 && (
          <p className="text-[#666] text-sm">No rooms yet — create one above.</p>
        )}
        {rooms.map((room) => (
          <div
            key={room.id}
            onClick={() => onEnterRoom(room.id)}
            className="px-3 py-2 mb-1 bg-[#252526] hover:bg-[#2a2d2e] rounded cursor-pointer text-sm"
          >
            {room.name}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Lobby