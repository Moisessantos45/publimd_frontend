<template>
    <header class="h-16 px-4 md:px-8 flex items-center justify-between bg-canvas-white/90 backdrop-blur-md border-b border-light-gray-border sticky top-0 z-50">
        <RouterLink to="/" class="flex items-center gap-2.5">
            <div class="w-7 h-7 rounded-md bg-forest-link/10 border border-forest-link/20 flex items-center justify-center transition-transform duration-200 hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-4 h-4 text-forest-link">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
            </div>
            <h1 class="text-[14px] font-pp-mori font-bold tracking-wide text-midnight-pine select-none">publimd</h1>
        </RouterLink>

        <div class="flex items-center gap-4">
            <RouterLink to="/login" class="text-[13px] font-medium text-ash-gray hover:text-midnight-pine transition-colors">Iniciar sesión</RouterLink>
            <RouterLink to="/register" class="px-4 py-1.5 bg-transparent border border-forest-link text-forest-link text-[13px] font-medium rounded-md hover:bg-forest-link/10 transition-colors">Registrarse</RouterLink>
        </div>
    </header>

</template>