module.exports = () => {
    return [
        {
            model: { key: 'm1', name: '模型1', desc: '模型1描述' },
            project: {
                p1: { key: 'p1', name: '项目1', desc: '项目1描述', homePage: '/page1' },
                p2: { key: 'p2', name: '项目2', desc: '项目2描述', homePage: '/page2' },
            }
        },
        {
            model: { key: 'm2', name: '模型2', desc: '模型2描述' },
            project: {
                p3: { key: 'p3', name: '项目3', desc: '项目3描述', homePage: '/page3' },
                p4: { key: 'p4', name: '项目4', desc: '项目4描述', homePage: '/page4' },
            }
        },
        {
            model: { key: 'm3', name: '模型3', desc: '模型3描述' },
            project: {}
        }
    ]
}