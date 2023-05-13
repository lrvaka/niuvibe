import React, { useState, ReactElement, ReactNode } from "react";
import { Form } from "react-final-form";

type ValidateFunction = (values: object) => object;

interface WizardProps {
  initialValues?: object;
  onSubmit: (values: any) => void;
  children: ReactElement<PageProps>[];
}

interface PageProps {
  children: ReactNode;
  validate?: ValidateFunction;
}

const Page: React.FC<PageProps> = ({ children }) => <>{children}</>;

const Wizard: React.FC<WizardProps> & { Page: React.FC<PageProps> } = ({
  initialValues,
  onSubmit,
  children,
}) => {
  const [page, setPage] = useState(0);
  const [values, setValues] = useState(initialValues || {});

  const next = (formValues: object) => {
    setPage(Math.min(page + 1, children.length - 1));
    setValues(formValues);
  };

  const previous = () => setPage(Math.max(page - 1, 0));

  const validate = (formValues: object) => {
    const activePage = children[page];
    return activePage.props.validate
      ? activePage.props.validate(formValues)
      : {};
  };

  const handleSubmit = (formValues: object) => {
    const isLastPage = page === children.length - 1;
    if (isLastPage) {
      return onSubmit(formValues);
    } else {
      next(formValues);
    }
  };

  const activePage = children[page];
  const isLastPage = page === children.length - 1;

  return (
    <Form initialValues={values} validate={validate} onSubmit={handleSubmit}>
      {({ handleSubmit, submitting }) => (
        <form onSubmit={handleSubmit}>
          {activePage}

          <div className="buttons">
            {page > 0 && (
              <button type="button" onClick={previous}>
                « Previous
              </button>
            )}

            {!isLastPage && <button type="submit">Next »</button>}
            {isLastPage && (
              <button type="submit" disabled={submitting}>
                Submit
              </button>
            )}
          </div>
        </form>
      )}
    </Form>
  );
};

Wizard.Page = Page;

export default Wizard;
