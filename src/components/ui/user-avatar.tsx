interface UserAvatarProps {
    user?: {
      first_name: string,
    }
  }
  
  export function UserAvatar({ user }: UserAvatarProps) {
    if (!user) return null
  
    return (
      <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
        <span className="text-emerald-600 font-medium">
          {user.first_name[0].toUpperCase()}
        </span>
      </div>
    )
  }