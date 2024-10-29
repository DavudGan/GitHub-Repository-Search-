export default {
  testEnvironment: 'jsdom',
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {tsConfig: 'tsconfig.app.json'}]
  },
  
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};