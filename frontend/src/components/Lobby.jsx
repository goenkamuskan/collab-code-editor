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
    <div className="flex items-center justify-center h-screen bg-[#111111]">
      <div className="w-[520px] bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden shadow-2xl">

        {/* Header strip */}
        <div className="px-8 pt-8 pb-6 border-b border-[#2a2a2a]">
          <p className="text-[#e8a33d] font-mono text-sm">$ collabcode</p>
          <p className="text-white text-lg font-medium mt-1">Your rooms</p>
          <p className="text-[#666] text-xs mt-1">{user.email}</p>
        </div>

        <div className="px-8 py-6">
          <form onSubmit={handleCreateRoom} className="flex gap-2 mb-6">
            <input
              type="text"
              placeholder="New room name"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              className="flex-1 bg-[#232323] border border-[#333] text-white text-sm px-3 py-2 rounded outline-none focus:border-[#e8a33d]"
            />
            <button
              type="submit"
              className="bg-[#e8a33d] hover:bg-[#d4922f] text-[#161616] text-sm font-medium px-4 py-2 rounded transition-colors"
            >
              Create
            </button>
          </form>

          <div className="max-h-64 overflow-y-auto flex flex-col gap-1">
            {loading && <p className="text-[#666] text-sm">Loading...</p>}
            {!loading && rooms.length === 0 && (
              <p className="text-[#666] text-sm">No rooms yet — create one above.</p>
            )}
            {rooms.map((room) => (
              <div
                key={room.id}
                onClick={() => onEnterRoom(room.id)}
                className="px-3 py-2.5 bg-[#1f1f1f] hover:bg-[#252525] border border-[#2a2a2a] rounded cursor-pointer text-sm text-[#ccc] hover:text-white transition-colors flex items-center justify-between"
              >
                <span>{room.name}</span>
                <span className="text-[#555] font-mono text-xs">→</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Lobby