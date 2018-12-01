defmodule Utils do

  @spec readlines(String.t()) :: [String.t()]
  def readlines(file) do
    File.stream!(file)
      |> Stream.map(&String.trim_trailing/1)
      |> Enum.to_list
  end

  @spec readlines_as_integers(String.t()) :: [integer]
  def readlines_as_integers(file) do
    Utils.readlines(file)
      |> Enum.map(&String.to_integer/1)
  end

  def to_tuples_via_regex(enumerable, regex) do
    enumerable
      |> Enum.map(fn x ->
        # First element in list is full match, skip that
        captures = tl Regex.run(regex, x)
        List.to_tuple captures
      end)
  end
end
