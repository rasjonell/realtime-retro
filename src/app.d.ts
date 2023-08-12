declare global {
	namespace App {}
	interface ImportMetaEnv {
		VITE_PK_HOST: string;
		VITE_PK_NAME: string;
		VITE_PK_USERNAME: string;
	}
}

export {};
