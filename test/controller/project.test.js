const supertest = require('supertest');
const assert = require('assert');
const md5 = require('md5');
const eplisCore = require('../../elpis-core');
const log = require('../../utils/log');

const signKey = 'fe7f165ec0314deea95fd9d391800c0c';
const st = Date.now();
const sSign = md5(`${signKey}_${st}`);

describe('测试 project 相关接口', function () {
  this.timeout(60000);

  let modelList;
  let projectList = [];
  let request;

  it('启动服务', async () => {
    // listen: false 时不占用端口，配合 supertest(app.callback()) 临时监听，测试结束后进程可正常退出
    const app = await eplisCore.start({ listen: false });
    modelList = require('../../model/index.js')(app);
    projectList = modelList.reduce(
      (pList, { project }) => [...pList, ...Object.keys(project).map((key) => project[key])],
      []
    );

    request = supertest(app.callback());
  });

  it('GET /api/proj without proj_key', async () => {
    let tmpRequest = request.get('/api/proj');
    tmpRequest = tmpRequest.set('s_t', st);
    tmpRequest = tmpRequest.set('s_sign', sSign);

    const res = await tmpRequest;
    const resBody = res.body;

    assert(resBody.success === false);
    assert(resBody.code === 442);
    assert(
      resBody.message.indexOf(
        "request validate failed: data should have required property 'proj_key'"
      ) > -1
    );
  });
  it('GET /api/proj fail', async () => {
    let tmpRequest = request.get('/api/proj');
    tmpRequest = tmpRequest.set('s_t', st);
    tmpRequest = tmpRequest.set('s_sign', sSign);
    tmpRequest = tmpRequest.query({
      proj_key: 'test key unexist!!!'
    });

    const res = await tmpRequest;
    const resBody = res.body;

    assert(resBody.success === false);
    assert(resBody.code === 50000);
    assert(resBody.message === '获取项目异常');
  });
  it('GET /api/proj with proj_key', async () => {
    function checkMenuItem(menuItem) {
      console.log('==== GET /api/proj with proj_key - menuItemKey ', menuItem.key);
      assert(menuItem.key);
      assert(menuItem.name);
      assert(menuItem.menuType);
      // 菜单是列表
      if (menuItem.menuType === 'group') {
        assert(menuItem.subMenu !== undefined);
        const { subMenu } = menuItem;
        subMenu.forEach((subMenuItem) => {
          checkMenuItem(subMenuItem);
        });
      }
      // 菜单是模块
      if (menuItem.menuType === 'module') {
        checkModule(menuItem);
      }
    }

    // 检查模块
    function checkModule(menuItem) {
      const { moduleType } = menuItem;
      assert(moduleType);
      if (moduleType === 'iframe') {
        const { iframeConfig } = menuItem;
        assert(iframeConfig);
        assert(iframeConfig.path !== undefined);
      }
      if (moduleType === 'custom') {
        const { customConfig } = menuItem;
        assert(customConfig);
        assert(customConfig.path !== undefined);
      }
      if (moduleType === 'schema') {
        const { schemaConfig } = menuItem;
        assert(schemaConfig);
        assert(schemaConfig.api !== undefined);
        assert(schemaConfig.schema);
      }
      if (moduleType === 'sider') {
        const { siderConfig } = menuItem;
        assert(siderConfig);
        assert(siderConfig.menu);
        const { menu } = siderConfig;

        menu.forEach((siderMenuItem) => {
          checkMenuItem(siderMenuItem);
        });
      }
    }

    async function sendRequest(projKey) {
      log.info('GET /api/proj with proj_key ', projKey);
      let tmpRequest = request.get('/api/proj');
      tmpRequest = tmpRequest.set('s_t', st);
      tmpRequest = tmpRequest.set('s_sign', sSign);
      tmpRequest = tmpRequest.query({
        proj_key: projKey
      });

      const res = await tmpRequest;
      const resBody = res.body;
      const resData = resBody.data;

      assert(resBody.success === true);
      assert(resData.key === projKey);
      assert(resData.modelKey);
      assert(resData.name);
      assert(resData.desc !== undefined);
      assert(resData.homePage !== undefined);

      const { menu } = resData;
      menu.forEach((menuItem) => {
        checkMenuItem(menuItem);
      });
    }

    for (let i = 0; i < projectList.length; i++) {
      const { key: projKey } = projectList[i];
      await sendRequest(projKey);
    }
  });

  it('GET /api/proj/list without proj_key', async () => {
    let tmpRequest = request.get('/api/proj/list');
    tmpRequest = tmpRequest.set('s_t', st);
    tmpRequest = tmpRequest.set('s_sign', sSign);

    const res = await tmpRequest;
    const resBody = res.body;
    const resData = resBody.data;

    assert(resBody.success === true);
    assert(resData.length === projectList.length);

    for (let i = 0; i < resData.length; i++) {
      const item = resData[i];
      // 断言 属性值存在
      assert(item.key);
      assert(item.modelKey);
      assert(item.name);
      assert(item.desc !== undefined);
      assert(item.homePage !== undefined);
    }
  });

  it('GET /api/proj/list with proj_key', async () => {
    const { key: projKey } = projectList[Math.floor(Math.random() * projectList.length)];
    const { modelKey } = projectList.find((item) => item.key === projKey) || {};

    let tmpRequest = request.get('/api/proj/list');
    tmpRequest = tmpRequest.set('s_t', st);
    tmpRequest = tmpRequest.set('s_sign', sSign);
    tmpRequest = tmpRequest.query({
      proj_key: projKey
    });

    const res = await tmpRequest;
    const resBody = res.body;
    const resData = resBody.data;

    assert(resBody.success === true);
    assert(projectList.filter((item) => item.modelKey === modelKey).length === resData.length);

    for (let i = 0; i < resData.length; i++) {
      const item = resData[i];
      // 断言 属性值存在
      assert(item.key);
      assert(item.modelKey);
      assert(item.name);
      assert(item.desc !== undefined);
      assert(item.homePage !== undefined);
    }
  });

  it('GET /api/proj/model_list', async () => {
    // 请求配置
    let tmpRequest = request.get('/api/proj/model_list');
    tmpRequest = tmpRequest.set('s_t', st);
    tmpRequest = tmpRequest.set('s_sign', sSign);

    const res = await tmpRequest;
    const resBody = res.body;
    const resData = resBody.data;

    assert(resBody.success === true);
    assert(resData.length > 0);

    for (let i = 0; i < resData.length; i++) {
      const item = resData[i];
      assert(item.model);
      assert(item.model.key);
      assert(item.model.name);
      assert(item.project);
      for (const projKey in item.project) {
        assert(item.project[projKey].key);
        assert(item.project[projKey].name);
      }
    }
  });
});
