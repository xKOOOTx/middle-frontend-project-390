import { type ComponentPropsWithoutRef } from 'react';

interface InputProps extends Omit<ComponentPropsWithoutRef<'input'>, 'id'> {
    id: string
}
export const Input = ({id, type="text", value, onChange, ...rest}: InputProps) => {



    return (
        <input 
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            {...rest}
            className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
            />
    )
}