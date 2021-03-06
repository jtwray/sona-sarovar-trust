import React, {Component} from 'react';
import PropTypes from 'prop-types';
import marked from 'marked';
import Modal from './Modal';

class MarkdownEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      markdownContent: props.markdownContent
    };

    this.updateMarkdown = this.updateMarkdown.bind(this);
    this.reset = this.reset.bind(this);
    this.done = this.done.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({markdownContent: nextProps.markdownContent});
  }

  done() {
    this.props.done(this.state.markdownContent);
  }

  reset() {
    this.setState({markdownContent: this.props.markdownContent});
  }

  updateMarkdown(e) {
    this.setState({markdownContent: e.target.value});
  }

  render() {
    const markdownContent = this.state.markdownContent;
    return (
      <Modal forceWidth="90%" show>
        <div className="markdown-editor">
          <div className="edit-section">
            <h3>Enter Markdown</h3>
            <textarea onChange={this.updateMarkdown} value={markdownContent} />
            <span>Learn about
              <a
                rel="noreferrer noopener"
                target="_blank"
                href="https://guides.github.com/features/mastering-markdown"
              >
                  Markdown
              </a>
            </span>
          </div>

          <div className="render-section">
            <h3>Rendered Markdown</h3>
            <div
              className="rendered-markdown"
              dangerouslySetInnerHTML={{__html: marked(markdownContent)}}
            />
          </div>

          <div className="button-holder">
            <button className="update" onClick={this.done}>Done</button>
            <button className="reset" onClick={this.reset}>Reset</button>
            <button className="back" onClick={this.props.back}>Back</button>
          </div>
        </div>
      </Modal>
    );
  }
}

MarkdownEditor.propTypes = {
  markdownContent: PropTypes.string.isRequired,
  done: PropTypes.func.isRequired,
  back: PropTypes.func.isRequired
};

export default MarkdownEditor;
