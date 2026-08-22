'use client'

import {useState,KeyboardEvent} from 'react';

interface ChatInputProps{
    onSend:(message:string)=> void
    disabled?:boolean
}

export default function ChatInput({onSend,disabled}:ChatInputProps){
    const [value,setvalue] = useState("")

    function handleSend(){
        const trimmed =value.trim()
        if(!trimmed || disabled) return
        onSend(trimmed)
        setvalue("")
    }

    function handleKeyDown(e:KeyboardEvent<HTMLTextAreaElement>){
        if(e.key ==="Enter" && !e.shiftKey){
            e.preventDefault()
            handleSend()
        } 
    }

    return (
        <div className='flex items-end gap-2 border-t border-gray-800 p-3'>
            <textarea
                value={value}
                onChange={(e)=>setvalue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Asl the agent to do something.."
                rows={1}
                disabled ={disabled}
                className='flex-1 resize-none rounded-md bg-gray-900 px-2 py-2 text-sm text-white outline-none disabled:opacity-50'
            />
            
            <button 
                onClick={handleSend}
                disabled={disabled || !value.trim()}
                className='rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50'
            >
            send
            </button>
        </div>
    )
}
