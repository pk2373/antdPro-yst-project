import React from 'react';
import { Button, notification, Card } from 'antd';
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/braft.css'

export default class NewPage extends React.Component {
  handleChange = (content) => {
    console.log(content)
  };

  render() {
    const editorProps = {
      height: 600,
      contentFormat: 'html',
      initialContent: '<p>Hello World!</p>',
      onChange: this.handleChange,
    }
    return (
      <Card title="富文本编辑器">
        <BraftEditor {...editorProps} ref={ instance => this.editorInstance = instance}  />
        <Button style={{ marginTop: 16 }} >保存</Button>
      </Card>
    );
  }
}
