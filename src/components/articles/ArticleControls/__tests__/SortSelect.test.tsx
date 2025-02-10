import { render, screen, fireEvent } from '@testing-library/react';
import { SortSelect } from '../SortSelect';

describe('SortSelect', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default value', () => {
    render(<SortSelect value="date" onChange={mockOnChange} />);

    const select = screen.getByLabelText('Sort by');
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue('date');
  });

  it('calls onChange when selection changes', () => {
    render(<SortSelect value="date" onChange={mockOnChange} />);

    const select = screen.getByLabelText('Sort by');
    fireEvent.change(select, { target: { value: 'title' } });

    expect(mockOnChange).toHaveBeenCalledWith('title');
  });

  it('displays sorting options in correct order', () => {
    render(<SortSelect value="date" onChange={mockOnChange} />);

    const options = screen.getAllByRole('option');

    expect(options).toHaveLength(2);
    expect(options[0]).toHaveTextContent('Newest First');
    expect(options[0]).toHaveValue('date');
    expect(options[1]).toHaveTextContent('By Title');
    expect(options[1]).toHaveValue('title');
  });
});
