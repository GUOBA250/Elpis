module.exports = {
    testEnvironment: 'jsdom',
    setupFiles: ['<rootDir>/tests/setup.js'],
    moduleFileExtensions: ['js', 'vue'],
    transform: {
        '^.+\\.js$': 'babel-jest',
        '^.+\\.vue$': '@vue/vue3-jest',
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/app/pages/$1',
        '^\\$pages/(.*)$': '<rootDir>/app/pages/$1',
        '^\\$common/(.*)$': '<rootDir>/app/pages/common/$1',
        '^\\$widgets/(.*)$': '<rootDir>/app/pages/widgets/$1',
        '^\\$store/(.*)$': '<rootDir>/app/pages/store/$1',
    },
    testMatch: [
        '<rootDir>/tests/**/*.spec.js',
        '<rootDir>/tests/**/*.test.js',
    ],
    collectCoverage: true,
    coverageReporters: ['text', 'json', 'html'],
    coverageDirectory: '<rootDir>/tests/coverage',
    verbose: true,
}
